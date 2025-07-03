<?php
namespace App\Controllers;

use App\Models\Country;
use Core\Helpers;

class CountryController {
    private $model;

    public function __construct() {
        $this->model = new Country();
    }

    public function index() {
        $countries = $this->model->getAll();
        Helpers::sendResponse(['data' => $countries, 'count' => count($countries)]);
    }

    public function show($id) {
        $country = $this->model->getById($id);
        if (!$country) {
            Helpers::sendError('Country not found', 404);
        }
        Helpers::sendResponse(['data' => $country]);
    }

    public function store() {
        $input = Helpers::getJsonInput(['name']);
        $country = $this->model->create($input['name']);
        if (!$country) {
            Helpers::sendError('Country already exists', 409);
        }
        Helpers::sendResponse(['message' => 'Country created', 'data' => $country], 201);
    }

    public function update($id) {
        $input = Helpers::getJsonInput(['name']);
        $country = $this->model->update($id, $input['name']);
        if (!$country) {
            Helpers::sendError('Country name already exists or not found', 409);
        }
        Helpers::sendResponse(['message' => 'Country updated', 'data' => $country]);
    }

    public function destroy($id) {
        $deleted = $this->model->delete($id);
        if (!$deleted) {
            Helpers::sendError('Cannot delete country with associated travels', 409);
        }
        http_response_code(204);
    }
}
