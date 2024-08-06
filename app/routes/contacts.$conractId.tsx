import { Form } from "@remix-run/react";
import type { FunctionComponent } from "react";
import { useLoaderData } from "@remix-run/react";
import type { ContactRecord } from "../data";
import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/node";
import { getContact } from "../data";
import invariant from "tiny-invariant";


export async function loader({ params }: LoaderFunctionArgs) {
  invariant(!params.contactId, "Missing contactId param");
  const contactIds = params.conractId || '';

  const contact = await getContact(contactIds);
  if (!contact) throw new Response("Not Found", { status: 404 });
  return json(contact);
}

export default function Contact() {

  const contact = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src="https://cdn.shopify.com/s/files/1/0582/8218/0726/files/images_1.jpg?v=1722850487"
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
