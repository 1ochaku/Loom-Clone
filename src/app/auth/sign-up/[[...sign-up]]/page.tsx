import { SignUp } from '@clerk/nextjs'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const SignUpPage = ({children}: Props) => {
  return <SignUp />
}

export default SignUpPage