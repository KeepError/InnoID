import { useEffect, useState } from "react";
import { APIError } from "../lib/api/errors";

export function useAPIRequest<ResponseSchema, F extends (...args: any[]) => Promise<ResponseSchema>>(
  callback: (...args: Parameters<F>) => Promise<ResponseSchema>,
) {
  const [data, setData] = useState<ResponseSchema | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const call = (...args: Parameters<F>) => {
    setLoading(true);
    callback(...args)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error: APIError) => {
        setError(error);
        setLoading(false);
      });
  };

  return { data, error, loading, call };
}

export function old_old_useAPIRequest<ResponseSchema>() {
  const [data, setData] = useState<ResponseSchema | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [promise, setPromise] = useState<Promise<ResponseSchema> | null>(null);

  useEffect(() => {
    if (promise === null) {
      return;
    }
    setLoading(true);
    promise
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error: APIError) => {
        setError(error);
        setLoading(false);
      });
  }, [promise]);

  return { data, error, loading, setPromise };
}

export function old_useAPIRequest<ResponseSchema>(
  callback: () => Promise<ResponseSchema>,
  triggerInit: boolean = true
) {
  const [data, setData] = useState<ResponseSchema | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(triggerInit);

  useEffect(() => {
    if (!trigger) {
      return;
    }
    setTrigger(false);
    setLoading(true);
    callback()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error: APIError) => {
        setError(error);
        setLoading(false);
      });
  }, [trigger]);

  return { data, error, loading, setTrigger };
}
