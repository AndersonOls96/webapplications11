<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Participante;
use App\Models\Atividade;
use Illuminate\Database\Eloquent\Relations\BelongsTo;



class Inscricao extends Model
{
    protected $fillable = [
        'atividade_id',
        'participante_id',
    ];

    public function participantes(): BelongsTo {

        return $this->belongsTo(Participantes::class);
    }
    public function atividades(): BelongsTo {
        return $this->belongsTo(Atividades::class);
    }
}
