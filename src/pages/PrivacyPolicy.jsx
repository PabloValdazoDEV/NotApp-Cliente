import { Link } from "react-router";

const updatedAt = "10 de mayo de 2026";

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-5 py-10">
      <Link to="/" className="w-fit">
        Volver a NotApp
      </Link>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Ultima actualizacion: {updatedAt}</p>
        <h1 className="mt-2 text-3xl font-bold">Politica de privacidad</h1>
        <p className="mt-4">
          Esta politica explica como se tratan los datos personales en NotApp,
          una aplicacion para gestionar hogares, miembros, productos y listas de
          compra compartidas. NotApp es un proyecto personal para uso privado
          entre Pablo Valdazo de la Cruz y su entorno cercano, sin fines
          comerciales.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Responsable</h2>
        <p className="mt-3">
          Responsable del tratamiento: Pablo Valdazo de la Cruz. Correo de
          contacto: pablovaldazodelacruz00@gmail.com.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Datos que tratamos</h2>
        <ul className="mt-3 space-y-2">
          <li>Datos de cuenta: nombre, email, contrasena cifrada y token de sesion.</li>
          <li>Datos de perfil y hogar: imagen, nombre del hogar, miembros y roles.</li>
          <li>Contenido creado por usuarios: productos, categorias, supermercado, precios, descripciones y listas.</li>
          <li>Invitaciones, recuperacion de contrasena y comunicaciones necesarias del servicio.</li>
          <li>Datos tecnicos necesarios: identificadores, estado de conexion, acciones pendientes offline y registros de seguridad.</li>
        </ul>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Finalidades y base legal</h2>
        <ul className="mt-3 space-y-2">
          <li>Crear y mantener tu cuenta, hogares y listas: ejecucion del servicio solicitado.</li>
          <li>Permitir hogares compartidos e invitaciones: ejecucion del servicio y gestion de permisos.</li>
          <li>Guardar imagenes de perfil, hogar o producto: ejecucion del servicio cuando las subes voluntariamente.</li>
          <li>Mantener la sesion, sincronizar listas y recuperar cambios sin conexion: interes legitimo y funcionamiento tecnico necesario.</li>
          <li>Prevenir abuso, accesos indebidos y errores: interes legitimo en seguridad.</li>
        </ul>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Con quien se comparten los datos</h2>
        <p className="mt-3">
          Los datos de un hogar son visibles para los miembros de ese mismo
          hogar segun su rol. Tambien pueden intervenir proveedores tecnicos
          necesarios para prestar el servicio, como alojamiento, API, correo
          transaccional, almacenamiento de imagenes y sincronizacion en tiempo
          real. No vendemos tus datos personales.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Conservacion</h2>
        <p className="mt-3">
          Conservamos los datos mientras mantengas tu cuenta o mientras sean
          necesarios para prestar el servicio. Al borrar un hogar, producto,
          imagen o cuenta, se eliminara la informacion asociada salvo que sea
          necesario conservarla durante los plazos legalmente exigibles o para
          atender responsabilidades.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Tus derechos</h2>
        <p className="mt-3">
          Puedes solicitar acceso, rectificacion, supresion, oposicion,
          limitacion del tratamiento y portabilidad escribiendo a
          pablovaldazodelacruz00@gmail.com. Tambien puedes reclamar ante la
          autoridad de proteccion de datos competente si consideras que el
          tratamiento no es adecuado.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Seguridad y menores</h2>
        <p className="mt-3">
          Aplicamos medidas razonables para proteger la informacion, como
          autenticacion mediante token y control de permisos por hogar. NotApp
          no esta dirigida a menores de 14 anos.
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2>Cambios</h2>
        <p className="mt-3">
          Podemos actualizar esta politica cuando cambie la app, la normativa o
          los proveedores tecnicos. La fecha superior indica la version vigente.
        </p>
      </section>
    </main>
  );
}
