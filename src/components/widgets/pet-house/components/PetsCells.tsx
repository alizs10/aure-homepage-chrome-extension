import { BetterTypography } from '@/components/common/BetterTypography'
import { usePetHouse } from '../hooks/usePetHouse'
import PetWithCell from './PetWithCell'

export default function PetsCells() {

    const { data, alivePets, deadPets } = usePetHouse()

    const availableCells = 4 - alivePets.length;


    if (data.length === 0) {
        return (
            <div className="flex-1 min-h-0 flex-center rounded-b-3xl">

                <BetterTypography variant="sm">
                    Make born your first pet
                </BetterTypography>

            </div>
        )
    }

    return (
        <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 bg-secondary rounded-b-3xl">
            {alivePets.map(pet => (
                <PetWithCell key={pet.id} pet={pet} />
            ))}
            {deadPets.slice(0, availableCells).map(pet => (
                <PetWithCell key={pet.id} pet={pet} />
            ))}
        </div>
    )
}
