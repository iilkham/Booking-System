<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $services], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
        ]);

        $service = Service::create($request->all());
        return response()->json(['success' => true, 'data' => $service, 'message' => 'Услуга создана'], 201, [], JSON_UNESCAPED_UNICODE);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
        ]);

        $service = Service::findOrFail($id);
        $service->update($request->all());
        return response()->json(['success' => true, 'data' => $service, 'message' => 'Услуга обновлена'], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['success' => true, 'message' => 'Услуга удалена'], 200, [], JSON_UNESCAPED_UNICODE);
    }
}