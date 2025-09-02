export default function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-neutral-400">
        <p>
          © <span aria-label="year">{new Date().getFullYear()}</span> Sundram Pathak. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
