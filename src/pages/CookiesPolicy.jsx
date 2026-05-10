import { Link } from "react-router";

const updatedAt = "10 de mayo de 2026";

export default function CookiesPolicy() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-5 py-10">
      <Link to="/" className="w-fit">
        Volver a NotApp
      </Link>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Ultima actualizacion: {updatedAt}</p>
        <h1 className="mt-2 text-3xl font-bold">Politica de cookies</h1>
        <p className="mt-4">
          En NotApp usamos almacenamiento tecnico imprescindible para iniciar
          sesion, proteger la cuenta y mantener actualizadas las listas de
          compra, incluso si la conexion falla temporalmente.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Que usamos</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <strong>Cookie token:</strong> guarda el token de autenticacion para
            mantener la sesion iniciada. Tiene una duracion aproximada de 30 dias.
          </li>
          <li>
            <strong>localStorage notapp:listdo:pending-actions:</strong> guarda
            cambios pendientes en listas de compra cuando no hay conexion.
          </li>
          <li>
            <strong>localStorage notapp:listdo:items:</strong> guarda una copia
            local de la lista para poder verla mientras se recupera la conexion.
          </li>
        </ul>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Finalidad</h2>
        <p className="mt-3">
          Estos elementos son tecnicos y necesarios para prestar el servicio:
          autenticacion, seguridad, funcionamiento offline y sincronizacion en
          tiempo real. No usamos cookies publicitarias, de analitica ni de
          seguimiento de terceros.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Gestion</h2>
        <p className="mt-3">
          Puedes borrar las cookies y el almacenamiento local desde la
          configuracion de tu navegador. Si eliminas la cookie de sesion, tendras
          que iniciar sesion de nuevo. Si eliminas el almacenamiento local,
          podrian perderse cambios pendientes que todavia no se hubieran
          sincronizado con el servidor.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Cambios</h2>
        <p className="mt-3">
          Si en el futuro NotApp incorpora cookies no necesarias, como analitica
          o publicidad, se actualizara esta politica y se pedira el consentimiento
          cuando corresponda.
        </p>
      </section>
    </main>
  );
}
