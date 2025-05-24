import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'

type Props = {}

const DashboardPage = async (props: Props) => {
    // authentication required first
    // if account exists redirect them
    // if not, create an account in database (callback route)
    const auth = await onAuthenticateUser()
    if (auth.status === 200 || auth.status === 201) {
        return redirect(`/dashboard/${auth.user?.id}`)
    }

    if (auth.status === 400 || auth.status === 404 || auth.status === 500) {
        return redirect('/auth/sign-in')
    }
}

export default DashboardPage