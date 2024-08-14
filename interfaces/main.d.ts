export interface ChildrenProps {
    children?: React.ReactNode;
}

export interface MessValidatorRegis {
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    password2: string;
}

export interface MenuDropIconProps {
    menu:
    | [
        {
            title: string;
            icon: Element | JSX.Element;
            href: string;
        }
    ]
    | {
        title: string;
        icon: Element | JSX.Element;
        href: string;
    }[]
    | any[];
    children: ReactNode;

    logout: boolean;

    information?:
    {
        name: string | undefined;
        email: string | undefined;
    }

    className: string
}

export interface ListMenuHover {
    title: string
    href: string
}