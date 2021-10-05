import * as React from 'react';
import { History } from 'history';
import MenuBar from './components/MenuBar';

export interface LayoutProps {
    children?: React.ReactNode;
    history?: History
}

export class Layout extends React.Component<LayoutProps, {}> {

    constructor(props: LayoutProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <MenuBar />
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}