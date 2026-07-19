import React, { useMemo } from 'react'
import Cell from './Cell'
import type { CatColor, DogColor, Pet } from '../types'
import Dog from './Dog'
import Cat from './Cat'
import { getPetAge, isPetDead } from '../helpers'

interface PetWithCellProps {
    pet: Pet
}

export default function PetWithCell({ pet }: PetWithCellProps) {

    const age = useMemo(() => {
        return getPetAge(pet)
    }, [pet])

    const isDead = isPetDead(pet)

    return (
        <Cell pet={pet}>
            {pet.type === 'cat' ? (<Cat age={age} color={pet.color as CatColor} isDead={isDead} />) : (
                <Dog age={age} color={pet.color as DogColor} isDead={isDead} />
            )}
        </Cell>
    )
}
