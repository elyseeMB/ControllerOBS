import { PropsWithChildren, useCallback } from "react";
import { addToast, useAppStore } from "../../store/store.ts";
import { FaCheckCircle, FaTimes, FaInfoCircle, FaExclamationCircle } from "react-icons/fa";

export type ToastParams = {
  message: string,
  type: "info" | "success" | "warning" | "error"
}
// @ts-ignore
export const defaultFuncToast = (toast: ToastParams) => {
};


export function useToast() {
  const {pushToastRef} = addToast();
  return {
    pushToast: useCallback((toast: ToastParams) => {
      pushToastRef.current(toast);
    }, [pushToastRef]),
  };
}

export function ToastContextProvider({children}: PropsWithChildren) {
  
  return (
    <>
      {children}
      <Toasts/>
    </>
  );
}

function Toasts() {
  const toasts = useAppStore((state) => state.toasts);
  return <div className="wrapper__toast">
    {toasts.map((toast, index) => (
      <div className="toast-container" key={index}>
        <div className="wrapper__toast">
          <Toast {...toast}/>
        </div>
      </div>
    ))}
  </div>;
  
}


export function Toast({type, message}: ToastParams) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle/>;
      case "error":
        return <FaExclamationCircle/>;
      case "info":
        return <FaInfoCircle/>;
      case "warning":
        return <FaExclamationCircle/>;
      default:
        return null;
    }
  };
  
  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close">
        <FaTimes/>
      </button>
    </div>
  );
}
