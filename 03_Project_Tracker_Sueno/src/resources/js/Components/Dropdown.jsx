import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';
import { useTheme } from '@/Context/ThemeContext';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1',
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext);
    const { theme } = useTheme();

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    style={{
                        border: `1px solid ${theme.border}`,
                    }}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={`rounded-md ${contentClasses}`}
                        style={{
                            backgroundColor: theme.bg.paper,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    const { theme } = useTheme();

    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out ' +
                className
            }
            style={{
                color: theme.text.primary,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(212, 175, 55, 0.1)`;
                e.currentTarget.style.color = '#d4af37';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.text.primary;
            }}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
