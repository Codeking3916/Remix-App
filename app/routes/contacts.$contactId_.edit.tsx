import React from 'react'
import  {ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { getContact, updateContact } from '../data';


//loader
export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { contactId } = params;

    if (!contactId) {
        throw new Response("Missing Id", { status: 400 });
    }

    const contact = await getContact(contactId);

    if (!contact) {
        throw new Response("Not Found", { status: 404 });
    }

    return json({ contact });
};

//action
export const action = async ({ request, params }: ActionFunctionArgs) => {
    const data = await request.formData();
    const updates = Object.fromEntries(data);

    const { contactId } = params;

    if (!contactId) {
        throw new Response("Missing Id", { status: 400 });
    }

    try {
        await updateContact(contactId, updates);
        return redirect(`/contacts/${params.contactId}`);
        
    } catch (error) {
        console.error("Failed to update contact:", error);
        throw new Response("Failed to update contact", { status: 500 });
    }
};

function ContactEdit() {
    const { contact } = useLoaderData<typeof loader>()

    return (

        <Form key={contact.id} method='post' id="contact-form">
            <p>
                <span>Name</span>
                <input defaultValue={contact.first} aria-label="First name" name="first" type="text" placeholder="First" />
                <input defaultValue={contact.last} aria-label="Last name" name="last" placeholder="Last" type="text" />
            </p>
            <label>
                <span>Twitter</span>
                <input defaultValue={contact.twitter} name="twitter" placeholder="@jack" type="text" />
            </label>
            <label>
                <span>Avatar URL</span>
                <input defaultValue={contact.avatar} aria-label="Avatar URL" name="avatar" placeholder="https://example.com/avatar.jpg" type="text" />
            </label>
            <label>
                <span>Notes</span>
                <textarea name="notes" defaultValue={contact.notes} rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button">Cancel</button>
            </p>
        </Form>

    )
}

export default ContactEdit