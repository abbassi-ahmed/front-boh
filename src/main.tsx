import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./provider.tsx";
import "./index.css";
import AppRoutes from "./routes/routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider>
      <AppRoutes />
    </Provider>
  </BrowserRouter>
);
