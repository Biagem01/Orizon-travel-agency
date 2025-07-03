<?php
namespace Core;

class Router {
    private $routes = [];

    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }

    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }

    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute($method, $path, $handler) {
        $pattern = preg_replace('#\{([\w]+)\}#', '([\w-]+)', $path); // {id} → ([\w-]+)
        $pattern = "#^" . rtrim($pattern, '/') . "$#";

        $this->routes[$method][] = [
            'pattern' => $pattern,
            'handler' => $handler,
            'params' => $this->extractParams($path)
        ];
    }

    private function extractParams($path) {
        preg_match_all('#\{([\w]+)\}#', $path, $matches);
        return $matches[1];
    }

    public function dispatch($uri, $method) {
        $uri = parse_url($uri, PHP_URL_PATH);
        $uri = rtrim($uri, '/'); // Rimuove slash finali per coerenza
        $method = strtoupper($method);

        if (!isset($this->routes[$method])) {
            http_response_code(405);
            echo json_encode(['error' => 'Method Not Allowed']);
            return;
        }

        foreach ($this->routes[$method] as $route) {
            if (preg_match($route['pattern'], $uri, $matches)) {
                array_shift($matches); // rimuove il match completo
                $params = array_combine($route['params'], $matches) ?: [];

                $handler = $route['handler'];

                if (is_callable($handler)) {
                    // Funzione anonima (closure)
                    call_user_func_array($handler, array_values($params));
                    return;
                }

                // Array [ControllerClass::class, 'method']
                [$controllerClass, $methodName] = $handler;

                if (class_exists($controllerClass) && method_exists($controllerClass, $methodName)) {
                    $controller = new $controllerClass();
                    call_user_func_array([$controller, $methodName], array_values($params));
                    return;
                }
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }
}
