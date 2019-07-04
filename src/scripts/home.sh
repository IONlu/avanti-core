#!/bin/bash

function getHome ()
{
    local HOME=`eval echo ~$1`
    if [ $HOME = "~$1" ]
    then
        return 1
    fi
    echo $HOME
    return 0
}

getHome $1
exit $?
