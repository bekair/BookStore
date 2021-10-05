export enum EnumSaleStatus {
    ForSale = 1,
    PendingForAcception = 2,
    Sold = 3,
    WaitingForSale = 4
}

export const getMeaningfullStrings = (saleStatus: number) => {
    let stringLiteral: string = "";
    switch (saleStatus) {
        case 1:
            stringLiteral = 'For Sale';
            break;
        case 2:
            stringLiteral = 'Waiting For Acception';
            break;
        case 3:
            stringLiteral = 'Sold';
            break;
        case 4:
            stringLiteral = 'Not For Sale';
            break;
        default:
            stringLiteral = "Wrong Status"
            break;
    }

    return stringLiteral;
}