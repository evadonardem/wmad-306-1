<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment('Stay focused on the backend.');
})->purpose('Display an inspiring message');
