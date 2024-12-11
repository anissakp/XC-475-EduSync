type ResponseData = {
    completed: boolean;
    date: string; // Adjust the type if using a Date object
    event: string;
    id: string;
    source: string;
  };
  
  let dataStore: ResponseData[] | null = null;
  
  /** Sets the data in the global store */
  export const setData = (data: ResponseData[]): void => {
    dataStore = data;
  };
  
  /** Retrieves the data from the global store */
  export const getData = (): ResponseData[] | null => {
    return dataStore;
  };
  