<?php

use Core\Router;
use App\Controllers\CountryController;
use App\Controllers\TravelController;

$router = new Router();

// Homepage → mostra frontend.html
$router->get('/', function () {
    $file = __DIR__ . '/../public/frontend.html';
    if (file_exists($file)) {
        header('Content-Type: text/html');
        readfile($file);
    } else {
        http_response_code(404);
        echo 'frontend.html non trovato';
    }
});

// Countries routes
$router->get('/countries', [CountryController::class, 'index']);
$router->get('/countries/{id}', [CountryController::class, 'show']);
$router->post('/countries', [CountryController::class, 'store']);
$router->put('/countries/{id}', [CountryController::class, 'update']);
$router->delete('/countries/{id}', [CountryController::class, 'destroy']);

// Travels routes
$router->get('/travels', function () {
    $controller = new TravelController();
    $controller->index($_GET);
});
$router->get('/travels/{id}', [TravelController::class, 'show']);
$router->post('/travels', [TravelController::class, 'store']);
$router->put('/travels/{id}', [TravelController::class, 'update']);
$router->delete('/travels/{id}', [TravelController::class, 'destroy']);

return $router;
