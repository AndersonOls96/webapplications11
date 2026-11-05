<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participante extends Model
{
    protected $fillable =[
        'nome',
        'email',
    ];

    public function Inscricao():HasMany {
        return $this->hasMany(Inscricao::class);
    }
}
