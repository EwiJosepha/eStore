import NextAuth from "next-auth"
import type { NextAuthConfig, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { AdapterUser } from "@auth/core/adapters"
import { UserDeviceDetails } from "@/types"
import moment from "moment"
import envConf from "@/lib/env.conf"
import { api } from "@/lib/api"
import { login, verifyOtp } from "@/app/actions/auth"

export const config = {
    secret: envConf.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: envConf.GOOGLE_CLIENT_ID,
            clientSecret: envConf.GOOGLE_CLIENT_SECRET,

        }),
        GithubProvider({
            clientId: envConf.GITHUB_CLIENT_ID,
            clientSecret: envConf.GITHUB_CLIENT_SECRET,


        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {

                try {
                    const { email, password, loginType, code, userId, phone, redirectType, ...others } = credentials as unknown as { [key: string]: string } & { [key: string]: unknown }

                    let res: User & { error?: any } | null = null

                    if (loginType === 'verifyOtp') {
                        const result = await verifyOtp({ email, phone, userId, code: code as string, redirectType }, others as UserDeviceDetails)

                        if (!result.success || !result?.data) {
                            throw new Error(result?.error?.message ?? "Invalid login credentials")
                        }

                        res = result?.data

                    } else {
                        const result = await login({ ...credentials }, others as UserDeviceDetails)

                        if (!result.success || !result?.data) {
                            throw new Error(result?.error?.message ?? "Invalid login credentials")
                        }

                        res = result?.data
                    }

                    return res
                } catch (err) {
                    return { error: new Error((err as Error)?.message ?? "Invalid login credentials") } as unknown as User
                }
            },

        }),
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
        verifyRequest: '/auth/verify-otp',
    },
    callbacks: {
        async signIn({ user, account, }) {
            if (account && account.provider === 'google') {
                const idToken = account?.id_token

                const res = await login({ type: "Google", idToken })

                if (!res.success || !res?.data) {
                    throw new Error(res?.error?.message ?? "Invalid login")
                }

                if (res?.success) {
                    const userData = res.data
                    user = userData
                }

            }

            const data: any = user

            if (data?.error) {
                throw new Error(data?.error?.message ?? "Invalid login credentials")
            }

            // Redirect to otp page if returned user data requires otp confirmation
            if (user?.requiresOtp) {
                console.log('requires otp')
                return `${envConf.NEXTAUTH_URL}/verify-otp?token=${encodeURIComponent(JSON.stringify(user))}` // need to encode this real well so that value would be some encoded string (encode with secret)
            }

            return true
        },
        async jwt({ token, user, account }) {
            // for first time login, we're gonna have a user object and an account object
            if (user) {
                // if the user is a normal oauth user, then jwt did not wait for signin to complete, thus we just need to sign in again. Note: credentials signin will always have the user object from our backend so this is just for oauth providers
                if (!user?.accessToken || !user?.refreshToken || !user?.id) {
                    if (account && account.provider === 'google') {
                        const idToken = account.id_token
                        try {
                            const res = await login({ type: "Google", idToken })

                            if (res?.success) {
                                const userData = res.data
                                user = userData
                            }
                        } catch (err) {
                            throw err
                        }
                    }
                }

                token.accessToken = user?.accessToken
                token.userId = user?.id
                token.requiresOtp = user?.requiresOtp
                token.refreshToken = user?.refreshToken
                token.user = user
            }

            if (account) {
                token.provider = account.provider
            }

            // check for possibility of an expired access token so that we can renew it

            if (token?.accessToken && token?.refreshToken) {
                const diff = moment().diff(moment(token?.accessToken?.expireAt), 'minutes')

                if (diff >= -1) { //its left at least 1min for token to expire then renew it
                    try {
                        const res = await api.post('/users-service/auth/refresh-token', { refreshToken: token?.refreshToken?.token }, {
                            headers: {
                                Authorization: `Bearer ${token.accessToken.token}`
                            }
                        })

                        if (res?.data?.success) {
                            const { accessToken, refreshToken } = res.data.data
                            token.accessToken = accessToken
                            token.refreshToken = refreshToken
                        }
                    } catch (err) {
                        throw err
                    }
                }
            }


            return token
        },
        async session({ session, token, user }) {
            // for oauth providers, we need to fetch our user object to update session user. NOTE: no need for credential provider since the user is coming from our db
            if (token?.provider === 'google') {
                const { data: user } = await api.get('/users-service/users/me', {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    },
                    method: 'GET'
                })

                if (user?.data) {
                    session.user = user.data as User & AdapterUser
                    token.requiresOtp = false
                    token.syncedToBackend = true
                    session.user.accessToken = token?.accessToken
                    session.user.refreshToken = token?.refreshToken
                }

                // Need some logic here
            } else {
                session.user = { ...(session?.user ?? {}), id: token.userId as string, ...(token?.user ?? {}) } as User & AdapterUser
            }

            session.requiresOtp = token.requiresOTP as boolean
            session.syncedToBackend = token?.syncedToBackend as boolean | undefined
            session.accessToken = token?.accessToken
            session.refreshToken = token?.refreshToken

            return session
        },
        async redirect({ url, baseUrl, }) {
            return url
        }


    },
    trustHost: true,

    events: {
        // async signIn(message) { console.log('signIn event', message, '\n signin event ..............................................') },
        // async signOut(message) { console.log('signOut event', message, '\n signOut event ..............................................') },
        // async session(message) { console.log('session event', message, '\n session event ..............................................') },

        // async jwt(message) { console.log('jwt event', message) },
        // async error(message) { console.error('redirect event', message) },
    },
    // debug: true,
    session: {
        strategy: 'jwt',
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)