#!/usr/bin/python3

from brownie import Token, accounts

def main():
    return Token.deploy({'from': accounts[0]})
