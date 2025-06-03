export const mcpHandler = async (req: any, res: any): Promise<void> => {
    res.json({
        data: 'Handled by Express!',
    });
}
