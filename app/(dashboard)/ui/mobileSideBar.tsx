import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import SideNav from './sidenav';

export default function MobileSideBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='shrink-0 md:hidden'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      {/* start of content of the sidenav menu in mobile view */}
      <SheetTitle className='sr-only'>Mobile sidebar</SheetTitle>
      <SheetContent
        side='left'
        className='flex flex-col bg-merino'
        >
        <SideNav />
      </SheetContent>
      <SheetDescription></SheetDescription>
      {/* end of content of the sidenav menu in mobile view */}
    </Sheet>
  );
}
