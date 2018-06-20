import './indexed_db';
import './local_storage';
import { browserFiles } from './browser_files';
import { browserHTTPRequest } from './browser_http';
import { decodeWeights, encodeWeights, getModelArtifactsInfoForJSON } from './io_utils';
import { ModelManagement } from './model_management';
import { IORouterRegistry } from './router_registry';
import { loadWeights } from './weights_loader';
var registerSaveRouter = IORouterRegistry.registerSaveRouter;
var registerLoadRouter = IORouterRegistry.registerLoadRouter;
var getSaveHandlers = IORouterRegistry.getSaveHandlers;
var getLoadHandlers = IORouterRegistry.getLoadHandlers;
var copyModel = ModelManagement.copyModel;
var listModels = ModelManagement.listModels;
var moveModel = ModelManagement.moveModel;
var removeModel = ModelManagement.removeModel;
export { browserFiles, browserHTTPRequest, copyModel, decodeWeights, encodeWeights, getLoadHandlers, getModelArtifactsInfoForJSON, getSaveHandlers, listModels, loadWeights, moveModel, registerLoadRouter, registerSaveRouter, removeModel };
//# sourceMappingURL=io.js.map