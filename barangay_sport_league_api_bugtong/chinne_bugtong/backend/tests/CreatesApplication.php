<?php

namespace Tests;

trait CreatesApplication
{
    public function createApplication()
    {
        return require __DIR__.'/../bootstrap/app.php';
    }
}
