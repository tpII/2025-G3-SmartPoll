export function Navbar() {
  return (
    <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img
              src='/smartpoll.svg'
              alt='Smartpoll Logo'
              width={48}
              height={48}
            />
            <div>
              <h1 className='text-xl font-bold text-foreground'>Smartpoll</h1>
              <p className='text-xs text-muted-foreground'>Elecciones 2025</p>
            </div>
          </div>
        </div>
      </header>
  )
}
