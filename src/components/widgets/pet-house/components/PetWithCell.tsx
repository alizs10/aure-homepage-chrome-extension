import React, { useMemo } from 'react'
import Cell from './Cell'
import type { CatColor, DogColor, Pet } from '../types'
import Dog from './Dog'
import Cat from './Cat'
import { getPetAge } from '../helpers'

interface PetWithCellProps {
    pet: Pet
}

export default function PetWithCell({ pet }: PetWithCellProps) {

    const age = useMemo(() => {
        return getPetAge(pet)
    }, [pet])

    return (
        <Cell pet={pet}>
            {pet.type === 'cat' ? (<Cat age={age} color={pet.color as CatColor} />) : (
                <Dog age={age} color={pet.color as DogColor} />
            )}
        </Cell>
    )
}
