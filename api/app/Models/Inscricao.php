<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscricao extends Model
{
    protected $fillable = [
        'atividades_id',
        'participantes_id',
    ];

    public function participantes(): BelongsTo {

        return $this->belongsTo(Participantes::class);
    }
    public function atividades(): BelongsTo {
        return $this->belongsTo(Atividades::class);
    }
}
