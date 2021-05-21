import axios from "axios";
import { useState } from 'react';

const useRequest = (initialErrors) => {
  let [errors, setErrors] = useState(initialErrors);

  const makeRequest = async ({ url, method, body, onSuccess }) => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      onSuccess && onSuccess(response.data);
      return response.data;
    } catch(e) {
      console.log(e);
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {
              e.response.data.errors.map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))
            }
          </ul>
        </div>
      );
    }
  }

  return {
    makeRequest,
    errors
  }
}

export default useRequest;