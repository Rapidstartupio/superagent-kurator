"use client";
import NextLink from "next/link";
import ky from "ky";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SUPERAGENT_VERSION } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

export default function Register() {

  const {
    formState: { isSubmitting, errors },
    register,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    window.parent.postMessage({ type: 'registerSuccess' }, 'https://kurator.ai')
    const handleLoginMessage = (event) => {
      if (event.origin === 'https://kurator.ai') {


        const {name, email, password } = event.data;

        const mydata={ name , email, password }

        onSubmit(mydata)
      }
    };

    window.addEventListener('message', handleLoginMessage);

    return () => {
      window.removeEventListener('message', handleLoginMessage);
    };
  }, []);

  const onSubmit = async (data) => {
    let payload = { ...data };

    const responseUser=await ky
    .post(`${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/auth/finduser`, {
      json: payload,
    })
    .json();
    console.log(responseUser)
    if(responseUser.user_exist=="yes"){
      console.log(responseUser)

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      });
      window.parent.postMessage({ type: 'registerSuccess' }, 'https://kurator.ai')
    }
    else{




      await ky
        .post(`${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/auth/sign-up`, {
          json: payload,
        })
        .json();





      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      });
      window.parent.postMessage({ type: 'registerSuccess' }, 'https://kurator.ai');
    }


  };

  return (
    <Container
      maxWidth="md"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      alignSelf="center"
      justifySelf="center"
    >
      <Stack spacing={8} minHeight="100vh" justifyContent="center">
        <HStack spacing={4} justifyContent="center" alignItems="center">
          <Text as="strong" fontSize="2xl">
          Chat Agents
          </Text>
          <Tag size="sm">{SUPERAGENT_VERSION}</Tag>
        </HStack>
        <Stack>
          <FormControl isInvalid={errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter full name..."
              {...register("name", { required: true })}
            />
            {errors?.name && <FormErrorMessage>Enter a name</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={errors?.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter email..."
              {...register("email", { required: true })}
            />
            {errors?.email && (
              <FormErrorMessage>Invalid email</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors?.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter password..."
              {...register("password", { required: true })}
            />
            {errors?.password && (
              <FormErrorMessage>Invalid password</FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Button
          backgroundColor="primary.500"
          type="submit"
          isLoading={isSubmitting}
        >
          Create account
        </Button>
        <HStack alignItems="center" justifyContent="center" fontSize="sm">
          <Text>Already have an account?</Text>
          <NextLink passHref href="/login">
            <Text color="orange.500" textDecoration="underline">
              Login
            </Text>
          </NextLink>
        </HStack>
      </Stack>
    </Container>
  );
}
