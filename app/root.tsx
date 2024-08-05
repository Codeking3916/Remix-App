import {
  Form,
  Outlet,
  Links,
  Meta,
  Link,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction, json  } from "@remix-run/node";
import styleSheet from "./app.css";
import { useLoaderData } from "@remix-run/react";
import { getContacts } from "./data";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styleSheet,
  },
];

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

export default function App() {

   const loaderData = useLoaderData<typeof loader>();
   const  {contacts} = loaderData;
  console.log(loaderData);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div id="details">
            <Outlet/>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
