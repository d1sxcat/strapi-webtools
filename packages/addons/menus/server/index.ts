/**
 * Application methods
 */
import bootstrap from "./bootstrap";
import register from "./register";

/**
 * Plugin server methods
 */
import contentTypes from "./content-types";
import config from "./config";
import services from "./services";
import routes from "./routes";
import controllers from "./controllers";

export default {
  bootstrap,
  register,
  config,
  services,
  contentTypes,
  routes,
  controllers,
};
