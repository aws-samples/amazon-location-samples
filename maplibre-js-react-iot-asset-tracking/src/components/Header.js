import { Button, Flex, useAuthenticator, useTheme } from '@aws-amplify/ui-react';
const Header = () => {
  const { signOut } = useAuthenticator();
  const { tokens } = useTheme();

  return (
    <Flex as="header" backgroundColor={tokens.colors.background.tertiary} height={tokens.space.xxl} justifyContent="flex-end">
      <Button onClick={signOut} size="small" backgroundColor={tokens.colors.brand.primary[60]} color='white'>Sign out</Button>
    </Flex>
  );
};

export default Header;