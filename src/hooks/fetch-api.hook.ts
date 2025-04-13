import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { api } from "../utils/interceptor";
import { addToast } from "@heroui/toast";
import { useLoading } from "../context/Loader.context";
export const baseUrl = import.meta.env.VITE_API_URL;
export const pdfUrl = import.meta.env.VITE_PDF_URL;
type Method = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
interface AxiosErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
}

export const useAxios = (
  url: string,
  method: Method | "",
  payload: any,
  name = "data",
  visibility = true,
  params?: any
) => {
  const { showLoader, hideLoader } = useLoading();

  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [refresh, setRefresh] = useState<any>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  const fetchData = async () => {
    if (!payload && method) {
      return;
    }
    try {
      showLoader();
      setError(null);
      setLoaded(true);

      const response = await api.request({
        data: payload,
        signal: controllerRef.current.signal,
        method,
        url: `${baseUrl}${url}`,
        params: params,
      });
      setResponseData(response.data);
    } catch (err) {
      setError(err as AxiosErrorResponse);

      if (error && error?.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "An error occurred";

        if (status === 400) {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        } else if (status === 500) {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        } else if (status === 502) {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        } else {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        }
      } else {
        addToast({
          title: "Error",
          description: "Error occurred",
          color: "danger",
        });
      }
    } finally {
      hideLoader();
      setLoaded(false);
    }
  };

  useEffect(() => {
    if (visibility) {
      fetchData();
    }
  }, [visibility]);

  useEffect(() => {
    if (refresh > 0) {
      fetchData();
    }
  }, [refresh]);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const submitRequest = async (
    payload: any,
    apiUrl?: string,
    toaster?: boolean,
    toastType?:
      | "danger"
      | "default"
      | "foreground"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | undefined
  ) => {
    try {
      showLoader();
      setError(null); // Reset error
      setLoaded(true);

      const response = await api.request({
        data: payload,
        method,
        url: `${baseUrl}${apiUrl ? apiUrl : url}`,
        params: params,
      });

      setResponseData(response.data);

      const msg = {
        POST: "created",
        PUT: "updated",
        DELETE: "deleted",
        PATCH: "updated",
      };

      if (toaster) {
        //@ts-ignore
        addToast({
          title: msg[method as keyof typeof msg],
          description: msg[method as keyof typeof msg],
          color: toastType || "primary",
        });
      }
    } catch (err) {
      const axiosError = err as AxiosErrorResponse; // Cast error
      setError(axiosError); // Set error object

      if (axiosError?.response) {
        const status = axiosError.response.status;
        const message =
          axiosError.response.data?.message || "An error occurred";

        if (status === 400) {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        } else if (status === 500) {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        } else if (status === 502) {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        } else {
          addToast({
            title: "Error",
            description: message,
            color: "danger",
          });
        }
      } else {
        addToast({
          title: "Error",
          description: "Error occurred",
          color: "danger",
        });
      }
    } finally {
      hideLoader();
      setLoaded(false);
    }
  };
  return {
    [name]: {
      responseData,
      error,
      loaded,
      submitRequest,
      refreshData,
      cancel,
    },
  };
};

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(
    () => new URLSearchParams(decodeURIComponent(search)),
    [search]
  );
};

export const getFile = (filename: any) => {
  return `${baseUrl}storage/${filename}`;
};
