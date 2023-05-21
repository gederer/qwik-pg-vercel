import { component$ } from "@builder.io/qwik";
import type { DocumentHead} from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { db } from "@vercel/postgres";

export const useRoleLoader = routeLoader$(async () => {
  const client = await db.connect();
  const roles = await client.sql`SELECT * FROM "Role"`;

  console.log(process.env);

  return roles.rows;
});

export default component$(() => {
  const roleLoader = useRoleLoader();

  return (
    <div>
      {roleLoader.value.map(role => (
        <div key={role.id}>{role.name}</div>
      ))}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
