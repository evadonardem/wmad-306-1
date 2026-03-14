<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogger
{
    public function log(
        ?User $actor,
        string $action,
        ?string $entityType = null,
        ?int $entityId = null,
        ?string $entityLabel = null,
        ?string $previousState = null,
        ?string $newState = null,
        ?string $note = null,
        array $meta = [],
    ): void {
        AuditLog::query()->create([
            'acting_user_id' => $actor?->id,
            'acting_role' => $actor?->getRoleNames()->first(),
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'entity_label' => $entityLabel,
            'previous_state' => $previousState,
            'new_state' => $newState,
            'note' => $note,
            'meta' => $meta,
        ]);
    }
}
