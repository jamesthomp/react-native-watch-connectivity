package com.wearconnectivity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSONArguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.wearable.CapabilityClient;
import com.google.android.gms.wearable.CapabilityInfo;
import com.google.android.gms.wearable.MessageClient;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;
import java.util.HashSet;
import java.util.Set;
import org.json.JSONException;
import org.json.JSONObject;

public class WearConnectivityModule extends WearConnectivitySpec
    implements MessageClient.OnMessageReceivedListener, LifecycleEventListener, 
    CapabilityClient.OnCapabilityChangedListener {
  public static final String NAME = "WearConnectivity";
  private static final String TAG = "react-native-wear-connectivity ";
  private MessageClient clientInternal;
  private String CLIENT_ADDED =
      TAG + "onMessageReceived listener added when activity is created. Client receives messages.";
  private String NO_NODES_FOUND = TAG + "sendMessage failed. No connected nodes found.";
  private String REMOVE_CLIENT =
      TAG + "onMessageReceived listener removed when activity is destroyed. Client does not receive messages.";
  private String ADD_CLIENT =
      TAG + "onMessageReceived listener added when activity is resumed. Client receives messages.";
  private String CONNECTED_DEVICE_IS_FAR = " Device is too far for bluetooth connection. ";
  private static final String CAPABILITY_PHONE = "SLPhone";
  private static final String CAPABILITY_WATCH = "SLWatch";
  private static final String REACHABILITY = "reachability";

  private CapabilityClient capabilityClientInternal;
  private final Set<Node> connectedCapabilityNodes = new HashSet<>();

  WearConnectivityModule(ReactApplicationContext context) {
    super(context);
    context.addLifecycleEventListener(this);
  }

  public MessageClient getMessageClient() {
    if (clientInternal == null) {
        synchronized (this) {
            if (clientInternal == null) {
                clientInternal = Wearable.getMessageClient(getReactApplicationContext());
            }
        }
    }
    return clientInternal;
}

public CapabilityClient getCapabilityClient() {
    if (capabilityClientInternal == null) {
        synchronized (this) {
            if (capabilityClientInternal == null) {
                capabilityClientInternal = Wearable.getCapabilityClient(getReactApplicationContext());
            }
        }
    }
    return capabilityClientInternal;
}

  private boolean isWearableDevice() {
    // This can be enhanced based on your needs
    return getReactApplicationContext().getPackageManager()
            .hasSystemFeature("android.hardware.type.watch");
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void sendMessage(ReadableMap messageData, Callback replyCb, Callback errorCb) {
    synchronized (connectedCapabilityNodes) {
      if (!connectedCapabilityNodes.isEmpty()) {
        for (Node connectedNode : connectedCapabilityNodes) {
          if (connectedNode.isNearby()) {
            sendMessageToClient(messageData, connectedNode, replyCb, errorCb);
          } else {
            FLog.w(
                    TAG,
                    TAG
                            + "connectedNode: "
                            + connectedNode.getDisplayName()
                            + CONNECTED_DEVICE_IS_FAR);
          }
        }
      } else {
        errorCb.invoke(NO_NODES_FOUND);
      }
    }
  }

  private void sendMessageToClient(
          ReadableMap messageData, Node node, Callback replyCb, Callback errorCb) {
    OnSuccessListener<Object> onSuccessListener =
            object -> replyCb.invoke("message sent to client with nodeID: " + object.toString());
    OnFailureListener onFailureListener =
            object -> errorCb.invoke("FAIL message send to client with nodeID: " + object.toString());
    try {
      // the last parameter is for file transfer (for ex. audio)
      JSONObject messageJSON = new JSONObject(messageData.toHashMap());
      Task<Integer> sendTask = getMessageClient().sendMessage(node.getId(), messageJSON.toString(), null);
      sendTask.addOnSuccessListener(onSuccessListener);
      sendTask.addOnFailureListener(onFailureListener);
    } catch (Exception e) {
      errorCb.invoke("sendMessage failed: " + e);
    }
  }

  public void onMessageReceived(MessageEvent messageEvent) {
    try {
      JSONObject jsonObject = new JSONObject(messageEvent.getPath());
      WritableMap messageAsWritableMap = (WritableMap) JSONArguments.fromJSONObject(jsonObject);
      sendEvent(getReactApplicationContext(), "message", messageAsWritableMap);
    } catch (JSONException e) {
      FLog.w(
              TAG,
              TAG
                      + "onMessageReceived with message: "
                      + messageEvent.getPath()
                      + " failed with error: "
                      + e);
    }
  }

  private void sendEvent(
          ReactContext reactContext, String eventName, Object params) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }

  @Override
  public void onHostResume() {
    getMessageClient().addListener(this);

    CapabilityClient capabilityClient = getCapabilityClient();
    String capability = isWearableDevice() ? CAPABILITY_WATCH : CAPABILITY_PHONE;
    capabilityClient.addLocalCapability(capability);

    String targetCapability = isWearableDevice() ? CAPABILITY_PHONE : CAPABILITY_WATCH;
    capabilityClient.addListener(this, targetCapability);

    Task<CapabilityInfo> capabilityInfoTask = capabilityClient.getCapability(
      targetCapability, CapabilityClient.FILTER_REACHABLE);

    capabilityInfoTask.addOnSuccessListener(
            capabilityInfo -> {
              updateConnectedNodes(capabilityInfo);
              sendCapabilityEvent(capabilityInfo);
            });
  }

  @Override
  public void onHostPause() {
  }

  @Override
  public void onHostDestroy() {
    getMessageClient().removeListener(this);

    String capability = isWearableDevice() ? CAPABILITY_WATCH : CAPABILITY_PHONE;
    CapabilityClient capabilityClient = getCapabilityClient();
    capabilityClient.removeLocalCapability(capability);
    capabilityClient.removeListener(this);
  }

  private void updateConnectedNodes(CapabilityInfo capabilityInfo) {
    synchronized (connectedCapabilityNodes) {
      connectedCapabilityNodes.clear();
      connectedCapabilityNodes.addAll(capabilityInfo.getNodes());
    }
  }

  @Override
  public void onCapabilityChanged(@NonNull CapabilityInfo capabilityInfo) {
    updateConnectedNodes(capabilityInfo);
    sendCapabilityEvent(capabilityInfo);
  }

  @ReactMethod
  public void isConnected(Promise promise) {
    boolean hasConnectedNodes = !connectedCapabilityNodes.isEmpty();
    promise.resolve(hasConnectedNodes);
  }

  private void sendCapabilityEvent(CapabilityInfo capabilityInfo) {
    sendEvent(getReactApplicationContext(), REACHABILITY, capabilityInfo.getNodes().size() > 0);
  }
}
