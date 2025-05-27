import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user, logout } = useAuth();

  const userNavigation = [
    { name: "Tu perfil", href: "/profile" },
    { name: "Cerrar sesión", onClick: logout },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                WattInvoice
              </span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="sr-only">Abrir menú de usuario</span>
                  {user.user_metadata?.avatar_url ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.user_metadata.avatar_url}
                      alt={user.email}
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-slate-700">
                    {user.email}
                  </span>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) =>
                          item.href ? (
                            <Link
                              to={item.href}
                              className={`${
                                active ? "bg-slate-100" : ""
                              } block px-4 py-2 text-sm text-slate-700`}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <button
                              onClick={item.onClick}
                              className={`${
                                active ? "bg-slate-100" : ""
                              } block w-full text-left px-4 py-2 text-sm text-slate-700`}
                            >
                              {item.name}
                            </button>
                          )
                        }
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
