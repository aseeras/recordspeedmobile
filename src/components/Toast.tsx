import DefaultToast, {
  BaseToast,
  ToastProps,
} from "react-native-toast-message";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "#DAF8E6", borderLeftColor: "#13C296" }}
      text1NumberOfLines={3}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "400",
        color: "#374151",
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "#F87171", borderLeftColor: "#DC2626" }}
      text1NumberOfLines={3}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "400",
        color: "#FFF",
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#13C296" }}
      text1NumberOfLines={2}
      text1Style={{
        fontSize: 14,
        fontWeight: "400",
      }}
    />
  ),
};

export default function ToastPlaceholder(props: ToastProps) {
  return <DefaultToast config={toastConfig} {...props} />;
}

export const Toast = DefaultToast;
