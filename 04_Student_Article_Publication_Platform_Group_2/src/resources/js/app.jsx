import "./bootstrap";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { Toaster, toast } from "react-hot-toast";

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },

    setup({ el, App, props }) {

        const root = createRoot(el);

        root.render(
            <>
                <Toaster position="top-right" />

                <App {...props} />

                {props?.initialPage?.props?.flash?.success &&
                    toast.success(props.initialPage.props.flash.success)}

                {props?.initialPage?.props?.flash?.error &&
                    toast.error(props.initialPage.props.flash.error)}
            </>
        );
    },
});