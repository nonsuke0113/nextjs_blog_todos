import { LockClosedIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'universal-cookie'

const cookie = new Cookie();

export default function Auth() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const login = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
      {
        method: "POST",
        body: JSON.stringify({username: username, password: password}),
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw "auth failed";
        }
      })
      .then((data) => {
        const options = { path: "/" };
        cookie.set("access_token", data.access, options);
      });
      router.push("/main-page")
    }
    catch(e) {
      console.log("login error")
      alert(e);
    }
  }

  const register = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`,
      {
        method: "POST",
        body: JSON.stringify({username: username, password: password}),
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((res) => {
        if (!res.ok) {
          throw "auth failed";
        }
      });
      login();
    }
    catch(e) {
      console.log("registor error")
      alert(e);
    }
  }

  const authUser = async (e) => {
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      register();
    }
  }

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white-900">
              { isLogin ? "Login" : "Sign up"}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={authUser}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                  }}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className='text-sm'>
                <span
                  className="cursor-pointer font-medium text-white hover:text-indigo-500"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  change mode ?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                { isLogin ? "Login with JWT" : "Create new User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
