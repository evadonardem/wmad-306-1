<?php

namespace Tests;

/**
 * Base test case for the application.
 *
 * This class provides the foundation for all feature and unit tests,
 * including the application creation trait.
 */
abstract class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
    use \Illuminate\Foundation\Testing\Concerns\CreatesApplication;
}
