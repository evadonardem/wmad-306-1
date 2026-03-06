<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index()
    {
        return inertia('Student/Settings/Index', [
            'user' => Auth::user()
        ]);
    }

    public function appearance()
    {
        return inertia('Student/Settings/Appearance', [
            'user' => Auth::user()
        ]);
    }
}
