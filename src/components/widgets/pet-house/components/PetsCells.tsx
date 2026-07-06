import { Typography } from '../../../common/Typography'
import { usePetHouse } from '../hooks/usePetHouse'
import PetWithCell from './PetWithCell'

export default function PetsCells() {

    const { alivePets } = usePetHouse()




    if (alivePets.length === 0) {
        return (
            <div className="flex-1 min-h-0 flex-center rounded-b-3xl">

                <Typography variant='caption'>
                    Make born your first pet
                </Typography>

            </div>
        )
    }

    return (
        <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 bg-secondary rounded-b-3xl">
            {alivePets.map(pet => (
                <PetWithCell key={pet.id} pet={pet} />
            ))}
        </div>
    )
}
