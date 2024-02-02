import { ReportHandler } from 'web-vitals';

// Define a function named reportWebVitals that takes an optional onPerfEntry parameter.
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  // Check if onPerfEntry is provided and is a function.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import specific functions from the 'web-vitals' library.
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call each web-vitals function with the onPerfEntry callback.
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
