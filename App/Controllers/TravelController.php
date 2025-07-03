<?php
namespace App\Controllers;

use App\Models\Travel;
use Core\Helpers;

class TravelController {
    private $model;

    public function __construct() {
        $this->model = new Travel();
    }

    public function index(array $queryParams = []) {
        $travels = $this->model->getAll($queryParams);
        Helpers::sendResponse([
            'data' => $travels['data'],
            'count' => $travels['count'],
            'total' => $travels['total'],
            'filters' => $queryParams
        ]);
    }

    public function show($id) {
        $travel = $this->model->getById($id);
        if (!$travel) {
            Helpers::sendError('Travel not found', 404);
        }
        Helpers::sendResponse(['data' => $travel]);
    }

    public function store() {
        $input = Helpers::getJsonInput(
            ['country_id', 'seats_available', 'title'],  // required
            ['description' => '', 'price' => null, 'start_date' => '', 'end_date' => '']  // optional
        );

        // Validazioni business
        if ((int)$input['seats_available'] < 0) {
            Helpers::sendError('Seats must be >= 0', 400);
        }
        if ($input['price'] !== null && (float)$input['price'] < 0) {
            Helpers::sendError('Price must be >= 0', 400);
        }
        if (!empty($input['start_date']) && !empty($input['end_date'])) {
            if (strtotime($input['start_date']) >= strtotime($input['end_date'])) {
                Helpers::sendError('End date must be after start date', 400);
            }
        }

        $id = $this->model->create($input);
        $createdTravel = $this->model->getById($id);

        Helpers::sendResponse([
            'message' => 'Travel created successfully',
            'data' => $createdTravel
        ], 201);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !is_array($input)) {
            Helpers::sendError('Invalid JSON data', 400);
        }

        $allowed = ['country_id', 'seats_available', 'title', 'description', 'price', 'start_date', 'end_date'];
        $updateData = [];
        foreach ($allowed as $field) {
            if (isset($input[$field])) {
                $updateData[$field] = $input[$field];
            }
        }

        if (empty($updateData)) {
            Helpers::sendError('No valid fields to update', 400);
        }

        if (isset($updateData['seats_available']) && (int)$updateData['seats_available'] < 0) {
            Helpers::sendError('Seats must be >= 0', 400);
        }
        if (isset($updateData['price']) && $updateData['price'] !== null && (float)$updateData['price'] < 0) {
            Helpers::sendError('Price must be >= 0', 400);
        }
        if (isset($updateData['start_date']) && isset($updateData['end_date'])) {
            if (strtotime($updateData['start_date']) >= strtotime($updateData['end_date'])) {
                Helpers::sendError('End date must be after start date', 400);
            }
        }

        // Controlla esistenza
        if (!$this->model->exists($id)) {
            Helpers::sendError('Travel not found', 404);
        }

        $this->model->update($id, $updateData);
        $updated = $this->model->getById($id);

        Helpers::sendResponse([
            'message' => 'Travel updated successfully',
            'data' => $updated
        ]);
    }

    public function destroy($id) {
        if (!$this->model->exists($id)) {
            Helpers::sendError('Travel not found', 404);
        }

        $this->model->delete($id);
        http_response_code(204);
        exit;
    }
}
