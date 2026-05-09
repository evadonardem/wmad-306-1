<?php

namespace App\Http\Controllers;

/**
 * Base controller for the application.
 *
 * This class extends Laravel's base controller and includes common traits
 * for authorization, job dispatching, and request validation.
 */
class Controller extends \Illuminate\Routing\Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    use \Illuminate\Foundation\Bus\DispatchesJobs;
    use \Illuminate\Foundation\Validation\ValidatesRequests;
}
